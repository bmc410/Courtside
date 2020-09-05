import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayerpickerPage } from './playerpicker.page';

describe('PlayerpickerPage', () => {
  let component: PlayerpickerPage;
  let fixture: ComponentFixture<PlayerpickerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerpickerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerpickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
