export type FreshVisionResult = {
  status: 'ok' | 'uncertain' | 'rejected' | 'mismatch';
  detail?: string;
  produce?: string;
  freshness?: string;
  freshness_key?: string;
  quality_grade?: string;
  produce_confidence?: number;
  freshness_confidence?: number;
  shelf_life?: string;
  expected_crop?: string;
  crop_match?: boolean;
};

const normalize = (value?: string) => value?.toLowerCase().replace(/[\s_-]/g, '') || '';

export function matchesExpectedCrop(detected?: string, expected?: string) {
  return normalize(detected) === normalize(expected);
}

export async function scanWithFreshVision(file: File): Promise<FreshVisionResult> {
  const formData = new FormData();
  formData.append('file', file, file.name);
  const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';
  const response = await fetch(`${aiServiceUrl}/api/v1/vision/scan`, { method: 'POST', body: formData });
  const result = await response.json();
  if (!response.ok) throw new Error(result.detail || result.message || 'Fresh Vision scan failed.');
  return result;
}

export function verifyExpectedCrop(result: FreshVisionResult, expectedCrop: string): FreshVisionResult {
  if (result.status !== 'ok') return { ...result, expected_crop: expectedCrop, crop_match: false };
  const crop_match = matchesExpectedCrop(result.produce, expectedCrop);
  return crop_match
    ? { ...result, expected_crop: expectedCrop, crop_match }
    : {
        ...result,
        status: 'mismatch',
        expected_crop: expectedCrop,
        crop_match,
        detail: `Expected ${expectedCrop}, but Fresh Vision detected ${result.produce}. Please upload the correct produce photo.`
      };
}
