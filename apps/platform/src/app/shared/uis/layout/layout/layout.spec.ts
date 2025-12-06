import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppLayout } from './layout';

describe('AppLayout', () => {
  let component: AppLayout;
  let fixture: ComponentFixture<AppLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLayout, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('app-header');
    expect(header).toBeTruthy();
  });

  it('should render footer', () => {
    const compiled = fixture.nativeElement;
    const footer = compiled.querySelector('app-footer');
    expect(footer).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const compiled = fixture.nativeElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have main content wrapper', () => {
    const compiled = fixture.nativeElement;
    const mainContent = compiled.querySelector('.main-content');
    expect(mainContent).toBeTruthy();
  });

  it('should render components in correct order', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const children = Array.from(compiled.children) as HTMLElement[];

    expect(children[0]?.tagName.toLowerCase()).toBe('app-header');
    expect(children[1]?.tagName.toLowerCase()).toBe('main');
    expect(children[2]?.tagName.toLowerCase()).toBe('app-footer');
  });

  it('should have router-outlet inside main content', () => {
    const compiled = fixture.nativeElement;
    const mainContent = compiled.querySelector('.main-content');
    const routerOutlet = mainContent?.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
