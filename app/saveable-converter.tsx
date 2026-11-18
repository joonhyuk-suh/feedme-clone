"use client";

import { Converter } from "@/components/feed-me/converter";
import { SaveButton } from "@/components/saved-articles/save-button";

/** 로그인한 사용자의 변환기: 변환 결과마다 저장 버튼을 붙인다. */
export function SaveableConverter() {
  return <Converter resultActions={(page) => <SaveButton page={page} />} />;
}
