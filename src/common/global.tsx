import { DataType, InputType } from '@share/enums/question-type';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ShortTextIcon from '@mui/icons-material/ShortText';
import SubjectIcon from '@mui/icons-material/Subject';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import EventIcon from '@mui/icons-material/Event';
import EmailIcon from '@mui/icons-material/Email';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';

export const QUESTION_DEFAULT_TYPE_LIST: {
  [key in InputType]: string;
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
  [key in InputType | DataType]: string;
} = {
  ...QUESTION_DEFAULT_TYPE_LIST,
  ...QUESTION_DEFAULT_DATA_TYPE_LIST,
};

export const QUESTION_DATA_TYPE_MAP: {
  [key in InputType | DataType]: { key: InputType; type: DataType };
} = {
  shortText: { key: InputType.ShortText, type: DataType.Text },
  longText: { key: InputType.LongText, type: DataType.Text },
  singleChoice: { key: InputType.SingleChoice, type: DataType.Text },
  multipleChoice: { key: InputType.MultipleChoice, type: DataType.Text },
  date: { key: InputType.ShortText, type: DataType.Date },
  time: { key: InputType.ShortText, type: DataType.Time },
  dateTime: { key: InputType.ShortText, type: DataType.DateTime },
  link: { key: InputType.ShortText, type: DataType.Link },
  file: { key: InputType.ShortText, type: DataType.File },
  image: { key: InputType.ShortText, type: DataType.Image },
  text: { key: InputType.ShortText, type: DataType.Text },
  email: { key: InputType.ShortText, type: DataType.Email },
  video: { key: InputType.ShortText, type: DataType.Video },
  location: { key: InputType.ShortText, type: DataType.Location },
  rating: { key: InputType.ShortText, type: DataType.Rating },
};

export const QUESTION_DEFAULT_TYPE_ICON: {
  [key in InputType]: React.ReactElement;
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
  [key in InputType | DataType]: React.ReactElement;
} = {
  ...QUESTION_DEFAULT_TYPE_ICON,
  ...QUESTION_DEFAULT_DATA_TYPE_ICON,
};
