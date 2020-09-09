import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IndividualstatsPage } from './individualstats.page';

describe('IndividualstatsPage', () => {
  let component: IndividualstatsPage;
  let fixture: ComponentFixture<IndividualstatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualstatsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualstatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
