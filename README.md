# Greenich customer website — updated

Static multi-page website, ready to upload as files to Cloudflare Pages. Uses the original Greenich PDF branding and product photos.

- Homepage: selected named customer reviews; Reviews page: additional named excerpts. Reviews and the 4.7/94 rating were supplied by the owner from the showroom’s Google Maps listing. Review counts are a snapshot, not live data.
- “More reviews” opens a Google Maps search for the named showroom. The link uses the verified Google Place ID and opens its Maps listing; visitors may need to select the Reviews tab. “Write a Google review” opens Google’s review composer for the same Place ID.
- Enquiry: only name, number, location, message. When arriving from a battery detail selection, the exact selected capacity/rating/model is carried in the outgoing message.
- Enquiry messages target **+91 97440 60044**. The visitor submits through their messaging app, with no server database required.
- Product detail gallery supports swipe, tap to zoom, and two indicators under the enlarged 95%-viewport gallery on phones.
- Wide responsive site containers use the available desktop viewport.
- Review rating/count and copied relative timestamps can change over time; refresh them periodically if publishing long term.
- Installable PWA requires HTTPS.
- Future Greenich inverter remains a non-production coming-soon image.

Open `index.html` in a browser to inspect locally, or deploy all files to Cloudflare Pages.

## Layout refinements
- Restored balanced horizontal page margins on large monitors; the site is capped at a generous 1540px outer canvas.
- Product gallery uses a narrower editorial width and consistent spacing.
- Gallery progress indicators span the same full width as the gallery photo panel on desktop and mobile.
- Mobile product photos sit within the normal page gutters, rather than extending beyond them.
- Service worker cache version updated so deployed visitors receive the new CSS.

## Latest change
- Removed the extra showroom/source label and “What customers say” heading above review cards on both Home and Reviews pages; retained review cards, rating and Google review links.
