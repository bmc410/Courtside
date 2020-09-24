import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GamestatsPage } from './gamestats.page';

describe('GamestatsPage', () => {
  let component: GamestatsPage;
  let fixture: ComponentFixture<GamestatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamestatsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GamestatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
