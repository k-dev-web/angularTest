import * as ASN1 from "@lapo/asn1js";

export class ParserServices {
  private dataStruct: { [key: string]: number[] } = {
    dateBefore: [4, 0],
    dateAfter: [4, 1],
    issuerCommonName: [3, 2, 0, 1],
    commonName: [5, 3, 0, 1],
  };

  private readFile(file: File): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private getData(cert: any): any {
    const result: any = {};
    Object.keys(this.dataStruct).forEach((key) => {
      let current = cert;
      this.dataStruct[key].forEach((index) => {
        current = current.sub[index];
      })
      result[key] = current.content();
    })
    return result;
  }

  public async parse(file: any) {
    const fileData = await this.readFile(file);
    const result: any = await ASN1.decode(fileData);
    if (result.typeName() !== 'SEQUENCE') {
      throw new Error('incorrect structure');
    }
    const cert: any = result.sub[0];
    return {file: fileData, data: this.getData(cert)};
  }

}
