import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors as c } from '../theme';
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={f.field}><Text style={f.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={c.textMuted} {...props} style={[f.input, props.multiline && { minHeight: 100, textAlignVertical: 'top' }, props.style]}/></View>;
}
export function Notice({ text, error = false }: { text: string; error?: boolean }) {
  return text ? <Text accessibilityRole={error ? 'alert' : undefined} accessibilityLiveRegion="polite" style={[f.notice, { color: error ? c.error : c.brand }]}>{text}</Text> : null;
}
export const f = StyleSheet.create({ field: { marginTop: 20 }, label: { fontSize: 14, color: c.textPrimary, fontWeight: '500', marginBottom: 8 }, input: { borderWidth: 1, borderColor: c.controlBorder, borderRadius: 12, minHeight: 52, padding: 12, color: c.textPrimary, backgroundColor: c.surface, fontSize: 16 }, notice: { fontSize: 14, lineHeight: 22, marginTop: 20 } });
