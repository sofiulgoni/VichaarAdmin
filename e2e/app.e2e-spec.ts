import { BlinkistPlusAdminPage } from './app.po';

describe('blinkist-plus-admin App', () => {
  let page: BlinkistPlusAdminPage;

  beforeEach(() => {
    page = new BlinkistPlusAdminPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
