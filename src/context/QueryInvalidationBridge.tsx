'use client';

import { useEventBus } from '@/store/event-bus.store';
import { notificationKeys, organizationKeys, surveyKeys } from '@/store/lib/query-key';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function QueryInvalidationBridge() {
  const qc = useQueryClient();
  const subscribe = useEventBus((s) => s.subscribe);

  useEffect(() => {
    return subscribe((e) => {
      switch (e.type) {
        case 'NOTIFICATION_RELOAD': {
          // 알림 갱신 관련 데이터 일괄
          qc.invalidateQueries({ queryKey: [notificationKeys.list()] });
          qc.invalidateQueries({ queryKey: [organizationKeys.list()] });
          qc.invalidateQueries({ queryKey: [surveyKeys.list()] });
          qc.invalidateQueries({ queryKey: [surveyKeys.metadata()] });
          break;
        }
        // case 'SURVEY_UPDATED': {
        //   // 특정 상세+파생만
        //   qc.invalidateQueries({
        //     predicate: (q) =>
        //       Array.isArray(q.queryKey) &&
        //       q.queryKey[0] === 'surveys' &&
        //       (q.queryKey[1] === 'detail' || q.queryKey[1] === 'stats') &&
        //       q.queryKey[2] === e.surveyId,
        //   });
        //   break;
        // }
      }
    });
  }, [qc, subscribe]);

  return null;
}
