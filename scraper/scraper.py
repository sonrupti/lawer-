from playwright.sync_api import sync_playwright


def scrape():

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=False
        )

        page = browser.new_page()

        # Open the official High Court website
        page.goto("https://orissahighcourt.nic.in/")

        print("\nBrowser opened.\n")

        print("Please do the following:")
        print("1. Click 'Case Status / Cause List / Orders / Judgments'")
        print("2. Search your case")
        print("3. Solve CAPTCHA")
        print("4. Click GO")
        print("5. Click VIEW")

        input("\nWhen the CASE DETAILS page is open, press ENTER...")

        html = page.content()

        browser.close()

        return html