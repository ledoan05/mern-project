import { GoogleGenAI } from "@google/genai";
import { productModel } from "../models/product.js";

export const listProduct = async (req, res) => {
  try {
    const { collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit } = req.query
    let query = {}

    // Fillter 
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category
    }
    if (material) {
      query.material = { $in: material.split(",") }

    }
    if (brand) {
      query.brand = { $in: brand.split(",") }
    }
    if (size) {
      query.size = { $in: size.split(",") }
    }
    if (color) {
      query.colors = { $in: [color] }
    }
    if (gender) {
      query.gender = gender
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }
    // Sort 
    let sort = {}
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 }
          break;
        case "priceDesc":
          sort = { price: -1 }
          break;
        case "popularity":
          sort = { rating: -1 }
          break;
        default:
          break;
      }
    }
    // Paginate
    const products = await productModel.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.status(200).json(products);
  } catch (error) {
    // console.log(error);
  }
}


export const chat = async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Định dạng tin nhắn không hợp lệ" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // LẤY DỮ LIỆU SÁCH
    const productData = await productModel.find({}); // lấy toàn bộ hoặc lọc theo yêu cầu

    // Ghép prompt người dùng
    const userPrompt = messages.map(msg => msg.content).join(" ");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              text: `
Bạn là trợ lý hữu ích giúp cung cấp thông tin về các sản phẩm thời trang trong danh mục dưới đây.

1. Khi được hỏi "có bao nhiêu sản phẩm" hoặc các câu hỏi tương tự, hãy đếm số lượng sản phẩm trong danh mục và trả về con số chính xác.
2. Khi được hỏi về sản phẩm với mức giá cụ thể, hãy kiểm tra danh mục và đề xuất các sản phẩm nằm trong khoảng giá đó.
3. Khi được hỏi về sản phẩm thuộc thương hiệu, loại, chất liệu, màu sắc, size, v.v., hãy lọc đúng theo thuộc tính được hỏi từ danh mục.
4. Chỉ chào người dùng một lần ở đầu phản hồi của bạn.
5. Luôn cung cấp câu trả lời cụ thể dựa trên dữ liệu danh mục sản phẩm thực tế.
6. Không lặp lại lời chào trong các phản hồi tiếp theo.
7. Định dạng phản hồi của bạn bằng HTML. Sử dụng thẻ <p> cho đoạn văn, <h2> cho tiêu đề, <ul> và <li> cho danh sách, <b> cho văn bản in đậm.
8. Khi liệt kê sản phẩm, hãy định dạng dưới dạng bảng HTML với các cột: Tên sản phẩm, Giá, Số lượng tồn kho, Thương hiệu, Danh mục, Size, Màu sắc.

Dưới đây là danh mục sản phẩm (định dạng JSON):

${JSON.stringify(productData, null, 2)}
`
            },
            { text: userPrompt }
          ]
        }
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0
        },
      }
    });

    // Lấy kết quả đúng field
    let replyText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result?.text ||
      "Không có phản hồi từ Gemini.";
    res.json({ reply: replyText });
  } catch (err) {
    console.error("❌ Lỗi từ Gemini API:", err.message);
    res.status(500).json({ error: "Không thể lấy phản hồi từ Gemini" });
  }
};

