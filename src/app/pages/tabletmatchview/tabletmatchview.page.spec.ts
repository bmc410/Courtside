import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabletmatchviewPage } from './tabletmatchview.page';

describe('TabletmatchviewPage', () => {
  let component: TabletmatchviewPage;
  let fixture: ComponentFixture<TabletmatchviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabletmatchviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabletmatchviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
