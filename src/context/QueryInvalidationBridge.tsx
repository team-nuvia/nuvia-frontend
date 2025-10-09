'use client';

import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import queryKeys from '@/store/lib/query-key';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function QueryInvalidationBridge() {
  const qc = useQueryClient();
  const subscribe = useEventBus((s) => s.subscribe);

  useEffect(() => {
    return subscribe((e) => {
      switch (e.type) {
        case AppEventType.NOTIFICATION_RELOAD: {
          // 알림 갱신 관련 데이터 일괄
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.metadata() });
          qc.invalidateQueries({ queryKey: queryKeys.notification.list() });
          qc.invalidateQueries({ queryKey: queryKeys.organization.list() });
          break;
        }
        case AppEventType.NOTIFICATION_REFRESH: {
          qc.invalidateQueries({ queryKey: queryKeys.notification.list() });
          qc.invalidateQueries({ queryKey: queryKeys.organization.list() });
          break;
        }
        case AppEventType.SURVEY_TOGGLE_VISIBILITY: {
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          break;
        }
        case AppEventType.SURVEY_UPDATED:
        case AppEventType.SURVEY_DELETED: {
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.metadata() });
          break;
        }
        case AppEventType.ORGANIZATION_UPDATED: {
          qc.invalidateQueries({ queryKey: queryKeys.organization.list() });
          qc.invalidateQueries({ queryKey: queryKeys.dashboard.metadata() });
          qc.invalidateQueries({ queryKey: queryKeys.dashboard.recentSurvey() });
          qc.invalidateQueries({ queryKey: queryKeys.graph.dailyResponseCount() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.metadata() });
          break;
        }
        case AppEventType.SURVEY_BIN_RESTORED: {
          qc.invalidateQueries({ queryKey: queryKeys.survey.binList() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.metadata() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          break;
        }
        case AppEventType.USER_SETTINGS_UPDATED: {
          qc.invalidateQueries({ queryKey: queryKeys.user.settings() });
          break;
        }
        case AppEventType.UPDATE_NICKNAME_UPDATED: {
          qc.invalidateQueries({ queryKey: queryKeys.user.me() });
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
