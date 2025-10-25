'use client';

import { useAuthStore } from '@/store/auth.store';
import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';
import queryKeys from '@/store/lib/query-key';
import { getUsersMe } from '@api/user/get-users-me';
import { SurveyStatus, SurveyStatusList } from '@share/enums/survey-status';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function QueryInvalidationBridge() {
  const qc = useQueryClient();
  const subscribe = useEventBus((s) => s.subscribe);
  const setUser = useAuthStore((s) => s.actions.setUser);
  /* 서버사이드 유저 데이터 -> 클라이언트에서 업데이트 (보조 장치) */
  const { mutate: updateUserMutation } = useMutation({
    mutationFn: getUsersMe,
    onSuccess: (data) => {
      setUser(data.payload);
    },
  });

  useEffect(() => {
    return subscribe((e) => {
      switch (e.type) {
        case AppEventType.NOTIFICATION_RELOAD: {
          // 알림 갱신 관련 데이터 일괄
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          for (const status of [SurveyStatusList.join(','), SurveyStatus.Draft, SurveyStatus.Active, SurveyStatus.Closed]) {
            qc.invalidateQueries({ queryKey: queryKeys.survey.list(status as SurveyStatus) });
          }
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
          for (const status of [SurveyStatusList.join(','), SurveyStatus.Draft, SurveyStatus.Active, SurveyStatus.Closed]) {
            qc.invalidateQueries({ queryKey: queryKeys.survey.list(status as SurveyStatus) });
          }
          break;
        }
        case AppEventType.SURVEY_UPDATED:
        case AppEventType.SURVEY_DELETED: {
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          for (const status of [SurveyStatusList.join(','), SurveyStatus.Draft, SurveyStatus.Active, SurveyStatus.Closed]) {
            qc.invalidateQueries({ queryKey: queryKeys.survey.list(status as SurveyStatus) });
          }
          qc.invalidateQueries({ queryKey: queryKeys.survey.metadata() });
          break;
        }
        case AppEventType.ORGANIZATION_UPDATED: {
          qc.invalidateQueries({ queryKey: queryKeys.organization.list() });
          qc.invalidateQueries({ queryKey: queryKeys.dashboard.metadata() });
          qc.invalidateQueries({ queryKey: queryKeys.dashboard.recentSurvey() });
          qc.invalidateQueries({ queryKey: queryKeys.graph.dailyResponseCount() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          for (const status of [SurveyStatusList.join(','), SurveyStatus.Draft, SurveyStatus.Active, SurveyStatus.Closed]) {
            qc.invalidateQueries({ queryKey: queryKeys.survey.list(status as SurveyStatus) });
          }
          qc.invalidateQueries({ queryKey: queryKeys.survey.metadata() });
          qc.invalidateQueries({ queryKey: queryKeys.organization.settings() });
          break;
        }
        case AppEventType.ORGANIZATION_SETTINGS_UPDATED: {
          qc.invalidateQueries({ queryKey: queryKeys.organization.settings(e.payload?.subscriptionId) });
          qc.invalidateQueries({ queryKey: queryKeys.organization.list() });
          qc.invalidateQueries({ queryKey: queryKeys.notification.list() });
          updateUserMutation();
          break;
        }
        case AppEventType.SURVEY_BIN_RESTORED: {
          qc.invalidateQueries({ queryKey: queryKeys.survey.binList() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.metadata() });
          qc.invalidateQueries({ queryKey: queryKeys.survey.list() });
          for (const status of [SurveyStatusList.join(','), SurveyStatus.Draft, SurveyStatus.Active, SurveyStatus.Closed]) {
            qc.invalidateQueries({ queryKey: queryKeys.survey.list(status as SurveyStatus) });
          }
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
