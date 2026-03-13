import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';

const client = new Anthropic({ apiKey: config.claudeApiKey });

export interface ExtractedProduct {
  product_name: string;
  product_price: string;
  product_image: string;
  product_url: string;
  product_metadata: string;
}

function validateProduct(p: unknown): p is ExtractedProduct {
  if (typeof p !== 'object' || p === null) return false;
  const obj = p as Record<string, unknown>;
  return typeof obj.product_name === 'string' && obj.product_name.length > 0;
}

export async function extractProductsFromUrl(productPageUrl: string): Promise<ExtractedProduct[]> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system:
      'You are a furniture product data extractor. When given a product_url, search for that page, extract ALL product listings, and return ONLY a valid JSON array. No markdown, no backticks, no explanation. Each object must follow this exact format: {"product_name": "", "product_price": "", "product_image": "", "product_url": "", "product_metadata": ""}. product_metadata should contain any additional info like dimensions, materials, finishes, or ratings.',
    messages: [
      {
        role: 'user',
        content: `Extract all products from this page.\nproduct_url: ${productPageUrl}`,
      },
    ],
    tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude API');
  }

  const products = JSON.parse(textBlock.text);
  if (!Array.isArray(products)) {
    throw new Error('Claude API did not return an array');
  }

  return products.filter(validateProduct);
}
