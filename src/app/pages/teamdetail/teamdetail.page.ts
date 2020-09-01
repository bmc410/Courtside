import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
import { ConnectionService } from 'ng-connection-service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { ClubWithId, TeamWithId } from 'src/app/models/appModels';


@Component({
  selector: 'app-teamdetail',
  templateUrl: './teamdetail.page.html',
  styleUrls: ['./teamdetail.page.scss'],
})
export class TeamdetailPage implements OnInit {
  context:string
  playersvisable = false;
  teamname: string;
  year: number
  selectedClub: number;  
  teamYears: Number[] = [];
  selectedclub:ClubWithId;
  clubs: ClubWithId[] = [];
  param:string;
  selectedTeam: TeamWithId;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService) { 
     
      this.route.queryParams.subscribe(params => {
        this.context = params['context'];
        if (this.context == undefined || this.context === "") {
          this.router.navigate(['/app/tabs/teams']);
        } 
        else if (this.context === "-1") {
          this.playersvisable = false;
        }
        else {
          let obj = JSON.parse(this.context)
          this.selectedTeam = JSON.parse(this.context);
          this.playersvisable = true;
        }
      });
  
    }



  async ngOnInit() {
    
    let year = new Date().getFullYear();
    this.teamYears.push(year);
    for (let index = 1; index < 5; index++) {
      year += 1;
      this.teamYears.push(year);
    }

    await this.matchService.getClubs().then(data => {
      var json = JSON.stringify(data);
      this.clubs = JSON.parse(json);
      this.selectedclub = this.clubs.filter(c => String(c.objectId) === this.selectedTeam?.ClubId)[0]
    });

   
  }

  pickYear(e) {

    
  }

  pickClub(e) {

  }

  save() {
    this.messageService.add({severity:'success', summary:'Upload Successfull', detail:'The data from this device has been successfully uploaded'});
  }

  compareFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = this.compareFn;

}
