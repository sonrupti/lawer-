from playwright.sync_api import sync_playwright
import os


def scrape(save_path="downloads/case_raw.html"):

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=False
        )

        context = browser.new_context()
        page = context.new_page()

        # Track every new tab/popup opened during this session, in order.
        # This works even if a popup opens as a result of clicking through
        # a JS confirmation dialog (like this site's "external link" Proceed
        # button), since Playwright still sees the underlying browser event
        # regardless of when we happen to check context.pages.
        opened_pages = []
        context.on("page", lambda new_page: opened_pages.append(new_page))

        # Open the official High Court website
        page.goto("https://orissahighcourt.nic.in/")

        print("\nBrowser opened.\n")

        print("Please do the following:")
        print("1. Click 'Case Status / Cause List / Orders / Judgments'")
        print("2. IMPORTANT: an 'Alert' popup will appear first, saying")
        print("   this link goes to an external site. Click 'Proceed' on")
        print("   THAT popup — this is what actually opens the eCourts tab.")
        print("3. On the new eCourts tab, click e.g. 'Case Number'")
        print("   (loads INSIDE an iframe on the same page)")
        print("4. Enter case details, solve CAPTCHA, click Search/GO")
        print("5. Click VIEW on the case you want")

        input("\nWhen the CASE DETAILS page is showing, press ENTER...")

        print(f"\nNew tabs/popups opened during this session: {len(opened_pages)}")
        for i, p in enumerate(opened_pages):
            print(f"  [{i}] {p.url}")

        all_pages = context.pages
        print(f"\nAll tabs currently open: {len(all_pages)}")
        for i, p in enumerate(all_pages):
            print(f"  [{i}] {p.url}")

        if not opened_pages and len(all_pages) <= 1:
            print("\nWARNING: No new tab was ever detected. The eCourts tab")
            print("likely never opened. Did you click 'Proceed' on the Alert")
            print("popup? Saving the homepage as a fallback so you can inspect it.")

        # Prefer the most recently opened popup; fall back to the last tab
        # in the context if no popup event fired for some reason.
        target_page = opened_pages[-1] if opened_pages else all_pages[-1]
        print(f"\nUsing page: {target_page.url}")

        target_page.wait_for_load_state("networkidle", timeout=5000)

        # The actual case content may load inside an iframe rather than the
        # top-level page. Try to find a frame named "ifr" first; otherwise
        # fall back to any child frame (not the main frame), since the site
        # may set the iframe name dynamically via JS.
        frame = target_page.frame(name="ifr")

        if frame is None:
            child_frames = [f for f in target_page.frames if f != target_page.main_frame]
            if child_frames:
                frame = child_frames[-1]

        if frame is not None:
            html = frame.content()
            print(f"Captured content from iframe (url: {frame.url})")
        else:
            print("\nNo iframe found. Available frames:")
            for f in target_page.frames:
                print(f"   name={f.name!r} url={f.url}")
            html = target_page.content()
            print("Falling back to outer page content (may be incomplete).")

        # Save the raw HTML so it can be parsed / inspected later,
        # even if parse_case() fails or the structure is unexpected.
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, "w", encoding="utf-8") as f:
            f.write(html)

        print(f"\nSaved raw HTML to {save_path}\n")

        browser.close()

        return html


if __name__ == "__main__":
    scrape()