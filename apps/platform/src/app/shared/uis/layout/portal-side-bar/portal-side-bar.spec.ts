import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalSideBar } from './portal-side-bar';

describe('PortalSideBar', () => {
  let component: PortalSideBar;
  let fixture: ComponentFixture<PortalSideBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalSideBar],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalSideBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
