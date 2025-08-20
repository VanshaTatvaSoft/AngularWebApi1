import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {
  private fingerprintValue: string | null = null;

  constructor() { }

  async getFingerPrint(): Promise<string> {
    if (this.fingerprintValue) return this.fingerprintValue;

    const fp = await FingerprintJS.load();
    const result = await fp.get();

    this.fingerprintValue = result.visitorId;
    return this.fingerprintValue;
  }
}
