import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: () => ({ push: mockPush }),
}));

import { useParams } from 'next/navigation';
import useCareerParam from './useCareerParam';

describe('useCareerParam', () => {
  it('returns a valid level key from params', () => {
    vi.mocked(useParams).mockReturnValue({ level: 'P1' });
    const { result } = renderHook(() => useCareerParam());
    expect(result.current[0]).toBe('P1');
  });

  it('returns null for an unrecognized level', () => {
    vi.mocked(useParams).mockReturnValue({ level: 'INVALID' });
    const { result } = renderHook(() => useCareerParam());
    expect(result.current[0]).toBeNull();
  });

  it('returns null when level param is absent', () => {
    vi.mocked(useParams).mockReturnValue({});
    const { result } = renderHook(() => useCareerParam());
    expect(result.current[0]).toBeNull();
  });

  it('calls router.push with the correct path on setLevel', () => {
    vi.mocked(useParams).mockReturnValue({ level: 'P1' });
    const { result } = renderHook(() => useCareerParam());
    act(() => {
      result.current[1]('P3');
    });
    expect(mockPush).toHaveBeenCalledWith('/P3');
  });

  it('recognizes EM level keys', () => {
    vi.mocked(useParams).mockReturnValue({ level: 'M3' });
    const { result } = renderHook(() => useCareerParam());
    expect(result.current[0]).toBe('M3');
  });
});
