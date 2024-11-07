import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, image, maskedArea } = req.body;

    // Initialize Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Convert base64 image to required format
    const imageBase64 = image.split(',')[1];
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png"
      }
    };

    // Enhance the prompt with specific instructions
    const enhancedPrompt = `
      Given this image, generate content for the masked/erased area with these specifications:
      - The masked area is at coordinates: x=${maskedArea.x}, y=${maskedArea.y}, width=${maskedArea.width}, height=${maskedArea.height}
      - User's request: ${prompt}
      - Ensure the generated content matches the style and lighting of the original image
      - Make the transition between the original and generated content seamless
    `;

    // Generate content
    const result = await model.generateContent([enhancedPrompt, imagePart]);
    const response = await result.response;
    
    // Process the generated image
    const generatedImage = response.text(); // Note: This is simplified - actual implementation
    // will depend on how Gemini returns the image data

    // Return the generated image
    return res.status(200).json({
      generatedImage: generatedImage,
    });

  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
}