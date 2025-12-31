import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, Box, IconButton,
    Grid, Chip, CircularProgress, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import CakeIcon from '@mui/icons-material/Cake';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import { dDayService } from '../services/dDayService';
import DDayManagerModal from './DDayManagerModal';

const ICONS = {
    event: <EventIcon />,
    cake: <CakeIcon />,
    love: <FavoriteIcon />,
    flight: <FlightTakeoffIcon />,
    star: <StarIcon />,
    work: <WorkIcon />
};

const calculateDDay = (targetDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { label: 'D-Day', isToday: true };
    if (diffDays > 0) return { label: `D-${diffDays}`, isFuture: true };
    return { label: `D+${Math.abs(diffDays)}`, isPast: true }; // 과거
};

export default function DDayWidget({ session }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (session) {
            loadEvents();
        } else {
            setEvents([]);
        }
    }, [session]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await dDayService.getEvents();
            setEvents(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <Card sx={{ height: '100%', minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        D-Day를 관리하려면 로그인이 필요합니다.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon color="action" /> 나의 D-Day
                        </Typography>
                        <IconButton size="small" onClick={() => setModalOpen(true)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : events.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 3, cursor: 'pointer' }} onClick={() => setModalOpen(true)}>
                            <Typography variant="body2" color="text.secondary">
                                등록된 일정이 없습니다.
                            </Typography>
                            <Button size="small" sx={{ mt: 1 }}>일정 추가하기</Button>
                        </Box>
                    ) : (
                        <Grid container spacing={1}>
                            {events.map((item) => {
                                const dDay = calculateDDay(item.date);
                                // 아이템 개수에 따른 그리드 컬럼 설정
                                // 4개 이하: 1열 (12)
                                // 5~8개: 2열 (6)
                                // 9개 이상: 3열 (4)
                                let gridXs = 12;
                                if (events.length >= 9) gridXs = 4;
                                else if (events.length >= 5) gridXs = 6;

                                const itemColor = item.color || '#1976d2';

                                return (
                                    <Grid item xs={gridXs} key={item.id}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 1.5,
                                                borderRadius: 1,
                                                bgcolor: 'background.default',
                                                boxShadow: 1,
                                                height: '100%', // 높이 맞춤
                                                borderLeft: `4px solid ${itemColor}`
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flexGrow: 1, mr: 1 }}>
                                                <Box sx={{ color: itemColor, display: 'flex' }}>
                                                    {ICONS[item.icon] || <EventIcon />}
                                                </Box>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: itemColor, fontWeight: 500 }}>
                                                        {item.date}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip
                                                label={dDay.label}
                                                size={dDay.isToday ? 'medium' : 'small'}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    bgcolor: dDay.isToday ? '#d32f2f' : itemColor,
                                                    color: '#fff'
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            <DDayManagerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                session={session}
                onUpdate={loadEvents}
            />
        </>
    );
}
