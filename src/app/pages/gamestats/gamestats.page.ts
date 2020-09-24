import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';

@Component({
  selector: 'app-gamestats',
  templateUrl: './gamestats.page.html',
  styleUrls: ['./gamestats.page.scss'],
})
export class GamestatsPage implements OnInit {
  context: any;
  constructor(private matchService: MatchService,
    private route: ActivatedRoute,) {
    this.matchService.loadMatches()
    this.route.queryParams.subscribe(params => {
      this.context = JSON.parse(params['context']);
    })

  }

  ngOnInit() {
  }

}
