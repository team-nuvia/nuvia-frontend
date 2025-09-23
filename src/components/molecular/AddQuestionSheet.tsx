// AddQuestionSheet.tsx (MUI v6 호환)
// 'use client';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Chip,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  SwipeableDrawer,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import * as React from 'react';

import { RemovePin } from '@assets/RemovePin';
import { QUESTION_DATA_TYPE_MAP, QUESTION_TYPE_ICONS, QUESTION_TYPE_MAP } from '@common/global';
import ActionButton from '@components/atom/ActionButton';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';

type QKey = keyof typeof QUESTION_TYPE_MAP; // QuestionType | DataType

const ALL = '전체';

const getMeta = (key: QKey) => (QUESTION_DATA_TYPE_MAP as any)?.[key] as { key: QuestionType; type?: DataType } | undefined;

const getCategory = (key: QKey) => (getMeta(key) as any)?.category ?? '기본';
const getIcon = (key: QKey) => ((QUESTION_TYPE_ICONS as any)?.[key] ? QUESTION_TYPE_ICONS[key] : <AddCircleOutlineIcon />);

export const AddQuestionSheet: React.FC<{
  onPick: (questionType: QuestionType, dataType?: DataType) => void;
  isMobile?: boolean;
}> = ({ onPick, isMobile = true }) => {
  const theme = useTheme();
  // const mobile = useMediaQuery(theme.breakpoints.down('md')) || isMobile;
  // const questionField = useField<AllQuestion[]>('questions');

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(ALL);

  const [pinned, setPinned] = React.useState<QKey[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nuvia:pinnedQuestions') || '[]');
    } catch {
      return [];
    }
  });
  const [recent, setRecent] = React.useState<QKey[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nuvia:recentQuestions') || '[]');
    } catch {
      return [];
    }
  });

  // QUESTION_TYPE_MAP 중에서 실제 메타(getMeta)가 있는 키만 노출
  const allKeys = React.useMemo(() => {
    return (Object.keys(QUESTION_TYPE_MAP) as QKey[]).filter((k) => k !== 'text' && Boolean(getMeta(k)));
  }, []);

  const categories = React.useMemo(() => {
    const set = new Set<string>([ALL]);
    allKeys.forEach((k) => set.add(getCategory(k)));
    return Array.from(set);
  }, [allKeys]);

  const filtered = React.useMemo(() => {
    return allKeys.filter((k) => {
      const label = QUESTION_TYPE_MAP[k] ?? String(k);
      const cat = getCategory(k);
      const byTab = active === ALL || cat === active;
      const q = query.trim().toLowerCase();
      const byQuery = !q || label.toLowerCase().includes(q) || String(k).toLowerCase().includes(q);
      return byTab && byQuery;
    });
  }, [allKeys, active, query]);

  const sorted = React.useMemo(() => {
    const pin = new Set(pinned);
    const rec = new Set(recent);
    const p = filtered.filter((k) => pin.has(k));
    const r = filtered.filter((k) => !pin.has(k) && rec.has(k));
    const rest = filtered.filter((k) => !pin.has(k) && !rec.has(k));
    return [...p, ...r, ...rest];
  }, [filtered, pinned, recent]);

  const handlePick = (k: QKey) => {
    const meta = getMeta(k);
    if (!meta) return;
    onPick(meta.key as QuestionType, meta.type as DataType | undefined);

    const nextRecent = [k, ...recent.filter((x) => x !== k)].slice(0, 8);
    setRecent(nextRecent);
    localStorage.setItem('nuvia:recentQuestions', JSON.stringify(nextRecent));
    setOpen(false);
  };

  const togglePin = (k: QKey, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    const next = pinned.includes(k) ? pinned.filter((x) => x !== k) : [k, ...pinned].slice(0, 8);
    setPinned(next);
    localStorage.setItem('nuvia:pinnedQuestions', JSON.stringify(next));
  };

  // if (!mobile) return null;

  const getCurrentPinned = (k: QKey) => {
    return pinned.includes(k);
  };

  return (
    <>
      <Fab color="primary" aria-label="질문 추가" onClick={() => setOpen(true)} sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1100 }}>
        <AddIcon />
      </Fab>

      <SwipeableDrawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slotProps={{
          swipeArea: {
            sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
          },
          paper: {
            sx: {
              width: '100%',
              maxWidth: isMobile ? '100%' : '30%',
              minWidth: 350,
              maxHeight: isMobile ? '85vh' : 'auto',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              overflow: 'hidden',
              height: '100%',
            },
          },
        }}
      >
        <Stack sx={{ p: 2, pt: 1, height: '100%' }}>
          {/* 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
              질문 유형 선택
            </Typography>
            <IconButton aria-label="닫기" onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 검색 */}
          <TextField
            fullWidth
            size="small"
            placeholder="유형 검색 (예: 단답형, 파일, 날짜)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 1 }}
          />

          {/* 탭: v6에서는 allowScrollButtonsMobile 제거, scrollButtons='auto'만 사용 */}
          <Tabs value={active} onChange={(_, v) => setActive(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 1 }}>
            {categories.map((c) => (
              <Tab key={c} value={c} label={c} sx={{ textTransform: 'none' }} />
            ))}
          </Tabs>

          {/* 핀/최근 */}
          {!query && active === ALL && (pinned.length > 0 || recent.length > 0) && (
            <Box sx={{ mb: 1.5 }}>
              {pinned.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    핀 고정
                  </Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {pinned.map((k) => (
                      <Chip
                        key={String(k)}
                        label={QUESTION_TYPE_MAP[k]}
                        onClick={() => handlePick(k)}
                        onDelete={(e) => togglePin(k, e as any)}
                        deleteIcon={<PushPinIcon fontSize="small" />}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              {recent.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    최근 사용
                  </Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {recent.slice(0, 6).map((k) => (
                      <Chip key={String(k)} label={QUESTION_TYPE_MAP[k]} onClick={() => handlePick(k)} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          <Stack sx={{ p: 2, backgroundColor: 'background.paper', overflowY: 'auto' }}>
            {/* 그리드 */}
            <Grid container spacing={1.25}>
              {sorted.map((k) => {
                const iconNode = getIcon(k);
                const label = QUESTION_TYPE_MAP[k];
                const cat = getCategory(k);
                return (
                  <Grid size={{ xs: 4 }} key={String(k)} component="div">
                    <ActionButton
                      color="black"
                      onClick={() => handlePick(k)}
                      sx={{
                        width: '100%',
                        borderRadius: 2,
                        p: 1.25,
                        display: 'block',
                        bgcolor: 'action.hover',
                        textAlign: 'center',
                        position: 'relative',
                        '&:active': { opacity: 0.9 },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>{iconNode}</Box>
                      <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.1 }}>
                        {label}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled' }}>
                        {cat}
                      </Typography>
                      <IconButton
                        component="div"
                        aria-label="핀 고정"
                        size="small"
                        onClick={(e) => togglePin(k, e)}
                        sx={{ position: 'absolute', right: 6, top: 6 }}
                      >
                        {getCurrentPinned(k) ? (
                          <SvgIcon fontSize="small">
                            <RemovePin />
                          </SvgIcon>
                        ) : (
                          <PushPinIcon fontSize="small" />
                        )}
                      </IconButton>
                    </ActionButton>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Stack>
      </SwipeableDrawer>
    </>
  );
};
