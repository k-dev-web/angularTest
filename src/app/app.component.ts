import {Component, HostListener} from '@angular/core';
import {CertificateProvider} from "../providers/certificate";
import * as ASN1 from "@lapo/asn1js";
import {ParserServices} from "../services/parser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  error: string = '';
  dragAreaClass: string = '';
  selectedItem: any = {index: -1, item: null};

  constructor(protected certs: CertificateProvider, protected parser: ParserServices) {
  }

  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.saveFiles(files);
  }

  ngOnInit() {
    this.dragAreaClass = "dragarea";
  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }

  async saveFiles(files: FileList) {
    if (files.length > 1) this.error = "Only one file at time allow";
    else {
      this.error = "";
      const data = await this.parser.parse(files[0]);
      await this.certs.addCert(data);
    }
  }

  changeSelected(index: number) {

    this.selectedItem = {
      item: index>=0?this.certs.cert.getValue()[index].data:null,
      index: index}
  }

}
