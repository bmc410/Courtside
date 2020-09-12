import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-scoremodal',
  templateUrl: './scoremodal.page.html',
  styleUrls: ['./scoremodal.page.scss'],
})
export class ScoremodalPage implements OnInit {
  fromPage: any;
  fromDialog: string;
  sbdata: any

  constructor(
    public dialogRef: MatDialogRef<ScoremodalPage>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fromPage = data.pageValue
  }

  ngOnInit() {
  }

}
