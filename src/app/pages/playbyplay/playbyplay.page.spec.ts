import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaybyplayPage } from './playbyplay.page';

describe('PlaybyplayPage', () => {
  let component: PlaybyplayPage;
  let fixture: ComponentFixture<PlaybyplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaybyplayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaybyplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
