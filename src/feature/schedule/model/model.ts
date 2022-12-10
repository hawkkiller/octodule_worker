export interface Schedule {
  title: string;
  days: Day[];
  chatId: string;
}

export interface Day {
  lessons: Lesson[];
  title: string;
  index: number;
}

export interface Lesson {
  title: string;
  content: string;
  keyValues: KV[];
}

export interface KV {
  key: string;
  value: string;
}