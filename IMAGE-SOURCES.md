# Photography source and licence record

**Status: selected for download; not yet downloaded or visually verified because runtime egress to Unsplash is blocked.** No generated warehouse imagery is used. Stock imagery must be labelled illustrative and must not imply ownership of pictured premises.

Source: Unsplash. Licence: https://unsplash.com/license (standard Unsplash licence; commercial use permitted, attribution appreciated but generally not required; no sale of unmodified photographs or compilation into a competing image service). Review the current licence and any subject-specific rights before launch. No Unsplash API is used.

| Local file | Source photograph URL | Intended use |
|---|---|---|
| `public/images/warehouse.jpg` | https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d | Warehouse hero/About image |
| `public/images/warehouse-contact.jpg` | Same photograph, smaller derivative | Contact composition |
| `public/images/electronics.jpg` | https://images.unsplash.com/photo-1546435770-a3e426bf472b | Headphones/category context |
| `public/images/household.jpg` | https://images.unsplash.com/photo-1507473885765-e6ed057f782c | Lighting/household context |
| `public/images/general.jpg` | https://images.unsplash.com/photo-1586023492125-27b2c045efd7 | General home goods context |

The download script requests JPEG output, 1600 px for the hero and 1000 px for other files at quality 82. Images are served locally, with dimensions specified and secondary images lazy loaded. Inspect subjects/crops once downloaded and correct alternative text if the source content differs. Downloaded image files and any source/author metadata should be retained with the site.
