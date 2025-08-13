import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ShortTextIcon from '@mui/icons-material/ShortText';
import StarIcon from '@mui/icons-material/Star';
import SubjectIcon from '@mui/icons-material/Subject';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';

export const QUESTION_DEFAULT_TYPE_LIST: {
  [key in QuestionType]: string;
} = {
  shortText: '단답형',
  longText: '장문형',
  singleChoice: '단일 선택',
  multipleChoice: '다중 선택',
};

export const QUESTION_DEFAULT_DATA_TYPE_LIST: {
  [key in DataType]: string;
} = {
  date: '날짜',
  time: '시간',
  dateTime: '날짜/시간',
  link: '링크',
  file: '파일',
  image: '이미지',
  text: '텍스트',
  email: '이메일',
  video: '비디오',
  location: '위치',
  rating: '평점',
};

export const QUESTION_TYPE_MAP: {
  [key in QuestionType | DataType]: string;
} = {
  ...QUESTION_DEFAULT_TYPE_LIST,
  ...QUESTION_DEFAULT_DATA_TYPE_LIST,
};

export const QUESTION_DATA_TYPE_MAP: {
  [key in QuestionType | DataType]: { key: QuestionType; type: DataType };
} = {
  shortText: { key: QuestionType.ShortText, type: DataType.Text },
  longText: { key: QuestionType.LongText, type: DataType.Text },
  singleChoice: { key: QuestionType.SingleChoice, type: DataType.Text },
  multipleChoice: { key: QuestionType.MultipleChoice, type: DataType.Text },
  date: { key: QuestionType.ShortText, type: DataType.Date },
  time: { key: QuestionType.ShortText, type: DataType.Time },
  dateTime: { key: QuestionType.ShortText, type: DataType.DateTime },
  link: { key: QuestionType.ShortText, type: DataType.Link },
  file: { key: QuestionType.ShortText, type: DataType.File },
  image: { key: QuestionType.ShortText, type: DataType.Image },
  text: { key: QuestionType.ShortText, type: DataType.Text },
  email: { key: QuestionType.ShortText, type: DataType.Email },
  video: { key: QuestionType.ShortText, type: DataType.Video },
  location: { key: QuestionType.ShortText, type: DataType.Location },
  rating: { key: QuestionType.ShortText, type: DataType.Rating },
};

export const QUESTION_DEFAULT_TYPE_ICON: {
  [key in QuestionType]: React.ReactElement;
} = {
  shortText: <ShortTextIcon />,
  longText: <SubjectIcon />,
  singleChoice: <RadioButtonCheckedIcon />,
  multipleChoice: <CheckBoxIcon />,
};

export const QUESTION_DEFAULT_DATA_TYPE_ICON: {
  [key in DataType]: React.ReactElement;
} = {
  date: <CalendarMonthIcon />,
  time: <AccessTimeIcon />,
  dateTime: <EventIcon />,
  link: <LinkIcon />,
  file: <InsertDriveFileIcon />,
  image: <ImageIcon />,
  text: <ShortTextIcon />,
  email: <EmailIcon />,
  video: <VideoCameraFrontIcon />,
  location: <LocationOnIcon />,
  rating: <StarIcon />,
};

export const QUESTION_TYPE_ICONS: {
  [key in QuestionType | DataType]: React.ReactElement;
} = {
  ...QUESTION_DEFAULT_TYPE_ICON,
  ...QUESTION_DEFAULT_DATA_TYPE_ICON,
};
