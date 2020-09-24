import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MatchsummaryPage } from './matchsummary.page';

describe('MatchsummaryPage', () => {
  let component: MatchsummaryPage;
  let fixture: ComponentFixture<MatchsummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchsummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchsummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
