import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import { useTheme } from '@mui/material/styles';

function TimeWidget() {
  const [time, setTime] = useState(new Date());
  const [timeColor, setTimeColor] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 테마 팔레트에서 사용할 색상 후보군
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      // theme.palette.text.primary // 기본 색상도 포함 가능하지만 '바꿔달라'는 요청에 따라 유채색 위주
    ];
    // 랜덤 선택
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setTimeColor(randomColor);
  }, [theme]); // 테마가 변경되면 색상도 다시 랜덤 선택 (팔레트 값 변경 반영)

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', containerType: 'inline-size' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Typography
          component="div"
          align="center"
          sx={{
            fontSize: '20cqw', // 컨테이너 너비의 약 13% (00:00:00 8글자 기준 적절)
            fontWeight: 'bold',
            color: timeColor,
            lineHeight: 1,
            transition: 'color 0.5s ease',
            whiteSpace: 'nowrap', // 줄바꿈 방지
            fontFamily: 'sans-serif' // 고정 폭으로 시간 흔들림 방지 (선택)
          }}
        >
          {time.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Typography>
        <Typography
          color="text.secondary"
          align="center"
          sx={{
            mt: 2,
            fontSize: '5cqw' // 날짜는 조금 더 작게
          }}
        >
          {time.toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TimeWidget;