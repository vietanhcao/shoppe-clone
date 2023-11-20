# SEO can bản

## SEO là gì?

SEO là viết tắt của Search Engine Optimization, dịch ra tiếng Việt là tối ưu hoá công cụ tìm kiếm. SEO là một quá trình tối ưu hoá website để tăng thứ hạng trên các công cụ tìm kiếm như Google, Bing, Yahoo, ... và tăng lượng truy cập vào website.

> Nếu 1 website tốt, sản phẩm tốt nhưng không ai biết, không ai click vào thì sản phẩm đó thất bại!

Để website được xếp haạn cao phụ thuộc rất nhiều yếu tố, nhưng quan trọng nhất vẫn là content.

> Content is king!

Ngoài ra còn những yếu tố khác nhau như blacklink, cấu trúc website, độ trust, ...

AE dev chúng ta chỉ can thiệp được yếu tố cấu trúc website thôi.

## Như thế nào là cấu trúc web chuẩn

- Dùng đúng nhiệm vụ các thẻ khai baá HTML như `<head>`, `<body>`, các thẻ heading, thẻ p
- Một trang của 1 web thì chỉ nên có 1 thẻ `<h1>`, các thẻ heading khác thì bao nhiêu cũng được.
- Sử duụn các thẻ meta, title cho từng trang
- URL dễ đọc
- Mô tả ảnh với alt
- Responsive trên mobile
- Tìm hiểu thêm Open Graph và chema JSOND để tăng tính thân thiện vơớ search engine

## SSR

Đúng là một số search engine hiện nay có thể render được javascript, ví dụ như google. Nhunư nếu js của website các bạn phức tạp thì thời gian render sẽ lâu và google thường sẽ bỏ qua => coi như là website bạn không có content.

Vậy nên giải pháp tốt nhất là render sẵn html ở server của ban.

Nếu dùng React thì hãy nghĩ đến NextJs, Remix

## Để website xuất hiện trên google

- Khai báo website với google search console
- Tạo sitemap cho website
- Tạo file robots.txt

## Website phải có tốc độ load nhanh

Reactjs đã render ở client rồi, mà còn chậm thì user sẽ thoát ra ngay. Nếu nhiều người dùng thoát ra thì sẽ làm tăng tỉ lệ "thoát trang" => website thứ hạng sẽ bị tụt trầm trọng.
Vậy nên ae dev cần phaiir optimize file build bằng code spliting, minified, gzip, xoá những thư viện không cần thiết, tree shaking

Ngoài ra thì cuũn nên có server tốt, CDN, caching,..

## Giả pháp nào cho việc seo cho reactjs thuần?

Như mình nói ở trên thì chỉ có vấn đề server side rendering ơ server là khó nhât.

Nếu đã lỡ sử dụng Reactjs rối thì cần cân nhắc giải pháp

Check user agent

- Nếu mà người dùng thì trả về reactjs
- Nếu mà là bot thì trả về cấu trúc thân thiện với search engine