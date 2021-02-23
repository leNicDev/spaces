import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  /**
   * Load the content of a file as string
   * @param file A local file
   */
  loadFileContentsAsString(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result as string);
      };
      reader.readAsText(file);
    });
  }

}
