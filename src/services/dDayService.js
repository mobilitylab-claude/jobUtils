import { supabase } from '../lib/supabaseClient';

export const dDayService = {
    /**
     * 이벤트 목록 조회 (날짜 오름차순)
     * RLS에 의해 자신의 데이터만 가져옴
     */
    getEvents: async () => {
        const { data, error } = await supabase
            .from('d_day_events')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * 이벤트 추가
     */
    addEvent: async (title, date, user_id, icon = 'event', color = '#1976d2') => {
        // user_id는 RLS 정책상 auth.uid()와 일치해야 insert 가능
        const { data, error } = await supabase
            .from('d_day_events')
            .insert([{ title, date, user_id, icon, color }])
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * 이벤트 삭제
     */
    deleteEvent: async (id) => {
        const { error } = await supabase
            .from('d_day_events')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * 이벤트 수정
     */
    updateEvent: async (id, title, date, icon, color) => {
        const { data, error } = await supabase
            .from('d_day_events')
            .update({ title, date, icon, color })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    }
};
