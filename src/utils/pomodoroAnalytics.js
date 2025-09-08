// 一天的毫秒數
const MS_DAY = 86400000;

// 取出本地日期
export const toLocalDayKey = t => {
  const d = new Date(t); // 將毫秒轉成 Date 物件
  d.setHours(0, 0, 0, 0); // 將時間都歸零
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const startOfWeek = (t = Date.now(), weekStartsOn = 1) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  const delta = (dow - weekStartsOn + 7) % 7;
  d.setTime(d.getTime() - delta * MS_DAY);
  return d;
};

export const formatWeekRange = (offset = 0, weekStartsOn = 1) => {
  const start = startOfWeek(Date.now() - offset * 7 * MS_DAY, weekStartsOn);
  const end = new Date(start.getTime() + 6 * MS_DAY);
  const fmt = x => `${x.getMonth() + 1}/${x.getDate()}`;
  return `${fmt(start)} - ${fmt(end)}`;
};

export const maxWeekOffsetFromHistory = (history, weekStartsOn = 1) => {
  if (!history?.length) return 0;
  const oldest = history.reduce((min, r) => Math.min(min, r.timeStamp), Infinity);
  const cur = startOfWeek(Date.now(), weekStartsOn);
  const old = startOfWeek(oldest, weekStartsOn);
  const diffDays = Math.floor((cur.getTime() - old.getTime()) / MS_DAY);
  return Math.max(0, Math.floor(diffDays / 7));
};

export function getWeekFocusMinutes(history, weekOffset = 0, weekStartsOn = 1) {
  // 今天日期
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 算出本週的「週起始日」
  const dow = today.getDay();
  const deltaToStart = (dow - weekStartsOn + 7) % 7;
  const start = new Date(today.getTime() - deltaToStart * MS_DAY - weekOffset * 7 * MS_DAY);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start.getTime() + i * MS_DAY);
    return {
      key: toLocalDayKey(d.getTime()),
      label: d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
      minutes: 0,
    };
  });
  const idx = new Map(days.map((d, i) => [d.key, i]));

  for (const r of history || []) {
    if (r.mode !== 'focus') continue;
    const key = toLocalDayKey(r.timeStamp);
    const i = idx.get(key);
    if (i != null) days[i].minutes += Math.round((r.duration || 0) / 60);
  }
  return days;
}

// console.log(getWeekFocusMinutes(mockData));
