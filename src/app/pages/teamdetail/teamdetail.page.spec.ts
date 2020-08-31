import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeamdetailPage } from './teamdetail.page';

describe('TeamdetailPage', () => {
  let component: TeamdetailPage;
  let fixture: ComponentFixture<TeamdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamdetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
