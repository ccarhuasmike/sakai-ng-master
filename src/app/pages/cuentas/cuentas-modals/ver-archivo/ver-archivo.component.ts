import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '@/pages/service/commonService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
@Component({
    
    selector: 'app-ver-archivo',
    templateUrl: './ver-archivo.component.html',
    styleUrls: ['./ver-archivo.component.scss'],
        standalone: true,
    imports: [ CommonModule],
    //providers: [MessageService,DialogService],
    encapsulation: ViewEncapsulation.None
})
export class VerArchivoComponent implements OnInit {

    fileName: any = null;
    base64File: any = null;
    displayFile: boolean = false;

    constructor(
        // public dialogRef: MatDialogRef<VerArchivoComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private sanitizer: DomSanitizer,
        private commonService: CommonService
    ) {
        this.displayFile = config.data.displayFile;
        this.fileName = config.data.fileName;
        this.base64File = this.sanitizer.bypassSecurityTrustResourceUrl(config.data.base64File);
    }

    ngOnInit(): void {
        // This is a ngOnInit
    }

    download() {
        const file = this.config.data.base64File;
        this.commonService.downloadFile(file, this.fileName);
    }
}
