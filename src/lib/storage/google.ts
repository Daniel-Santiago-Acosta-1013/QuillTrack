import { Note, Task } from '@/types';

const FOLDER_NAME = 'QuillTrack';
const FILE_NAME = 'quilltrack_data.json';

class GoogleDriveSync {
  private syncInterval: number | null = null;
  private accessToken: string | null = null;

  // Para leer los datos del store al hacer sync
  private storeRef: (() => { notes: Note[]; tasks: Task[] }) | null = null;

  /**
   * Inicializa la sincronización con Google Drive:
   * 1. Busca o crea la carpeta QuillTrack.
   * 2. Busca o crea el archivo quilltrack_data.json.
   * 3. Descarga los datos del archivo (si existen) y los retorna.
   * 4. Arranca la sincronización periódica.
   */
  async init(accessToken: string): Promise<{ notes: Note[]; tasks: Task[] } | null> {
    this.accessToken = accessToken;

    // 1. Obtener o crear carpeta
    const folderId = await this.getOrCreateFolder();

    // 2. Obtener o crear archivo
    const fileId = await this.getOrCreateDataFile(folderId);

    // 3. Descargar datos (si los hay)
    const driveData = await this.loadData(fileId);

    // 4. Iniciar sync periódico
    this.startPeriodicSync(fileId);

    // Retornar data (puede ser null si no hay nada en Drive)
    return driveData;
  }

  /**
   * Permite a la clase leer el estado actual (notas, tareas) desde el store de Zustand.
   * Se setea una sola vez después de enableSync en el store.
   */
  setStoreRef(storeRef: () => { notes: Note[]; tasks: Task[] }) {
    this.storeRef = storeRef;
  }

  private startPeriodicSync(fileId: string) {
    if (this.syncInterval) return;
    // Sincroniza cada 1 minuto
    this.syncInterval = window.setInterval(() => this.sync(fileId), 60 * 1000);
  }

  /**
   * Función principal de sincronización: 
   * toma las notas del store y las sube a Drive, 
   * opcionalmente podría también descargar la versión más reciente antes de sobrescribir.
   */
  async sync(fileId: string): Promise<void> {
    if (!this.accessToken || !this.storeRef) return;

    try {
      const { notes, tasks } = this.storeRef();
      await this.uploadData(fileId, { notes, tasks });
      console.log('Syncing with Google Drive... Data uploaded successfully.');
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  /**
   * Detiene la sincronización (se usa en logout o si se deshabilita).
   */
  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.accessToken = null;
    this.storeRef = null;
  }

  /**
   * Crea o recupera la carpeta "QuillTrack" en el Drive del usuario.
   */
  private async getOrCreateFolder(): Promise<string> {
    const existingFolderId = await this.findFolderByName(FOLDER_NAME);
    if (existingFolderId) {
      return existingFolderId;
    } else {
      return this.createFolder(FOLDER_NAME);
    }
  }

  /**
   * Busca la carpeta por nombre y retorna su id si existe.
   */
  private async findFolderByName(name: string): Promise<string | null> {
    const query = encodeURIComponent(`name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    const data = await res.json();

    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  }

  /**
   * Crea una carpeta con el nombre dado en la raíz de Drive.
   */
  private async createFolder(name: string): Promise<string> {
    const url = 'https://www.googleapis.com/drive/v3/files';
    const body = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data.id;
  }

  /**
   * Crea o recupera el archivo "quilltrack_data.json" en la carpeta dada.
   */
  private async getOrCreateDataFile(folderId: string): Promise<string> {
    const fileId = await this.findFileByName(FILE_NAME, folderId);
    if (fileId) {
      return fileId;
    } else {
      return this.createDataFile(FILE_NAME, folderId);
    }
  }

  /**
   * Busca un archivo por nombre dentro de la carpeta dada y retorna su id si existe.
   */
  private async findFileByName(name: string, folderId: string): Promise<string | null> {
    const query = encodeURIComponent(`name='${name}' and '${folderId}' in parents and trashed=false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    const data = await res.json();

    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  }

  /**
   * Crea el archivo JSON inicial en la carpeta especificada.
   */
  private async createDataFile(name: string, folderId: string): Promise<string> {
    // Primero creamos el "metadata" del archivo
    const metadata = {
      name,
      parents: [folderId],
    };

    // Cuerpo inicial vacío, con un JSON básico
    const fileContent = JSON.stringify({ notes: [], tasks: [] });

    // Subida a Drive (multipart)
    const boundary = 'END_OF_PART';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const body =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      closeDelimiter;

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      }
    );
    const data = await res.json();
    return data.id;
  }

  /**
   * Descarga y retorna el contenido JSON del archivo. Si no hay datos, retorna null.
   */
  private async loadData(fileId: string): Promise<{ notes: Note[]; tasks: Task[] } | null> {
    // Descargamos el archivo
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    // Si el archivo está vacío o no se pudo leer, retornamos null
    if (!res.ok) {
      console.warn('No se pudo leer el archivo en Drive.');
      return null;
    }

    try {
      const data = await res.json();
      // Validar la estructura
      if (!data.notes || !data.tasks) {
        return null;
      }
      return {
        notes: data.notes,
        tasks: data.tasks,
      };
    } catch (error) {
      console.warn('Archivo JSON inválido o vacío en Drive.');
      return null;
    }
  }

  /**
   * Sube (actualiza) el contenido JSON al archivo correspondiente.
   */
  private async uploadData(fileId: string, dataObj: { notes: Note[]; tasks: Task[] }) {
    const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    const body = JSON.stringify(dataObj);

    await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });
  }
}

export const googleDriveSync = new GoogleDriveSync();
