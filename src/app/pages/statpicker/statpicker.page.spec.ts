import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatpickerPage } from './statpicker.page';

describe('StatpickerPage', () => {
  let component: StatpickerPage;
  let fixture: ComponentFixture<StatpickerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatpickerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatpickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
