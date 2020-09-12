import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScoremodalPage } from './scoremodal.page';

describe('ScoremodalPage', () => {
  let component: ScoremodalPage;
  let fixture: ComponentFixture<ScoremodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoremodalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoremodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
