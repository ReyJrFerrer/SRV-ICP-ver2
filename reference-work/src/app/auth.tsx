import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';


// Code from Mark Branch
const authSchema = zod.object({
    email: zod.string().email({ message: 'Invalid email address' }),
    password: zod.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export default function Auth() {
    const { control, handleSubmit, formState } = useForm({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const signIn = async (data: zod.infer<typeof authSchema>) => {
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password
            });

            if (error) throw error;

            const user = authData.user;
            if (!user) {
                Alert.alert('Error', 'Authentication failed.');
                return;
            }

            const userId = user.id;
            const email = user.email;
            const username = user.user_metadata?.display_name ?? '';

            const { data: customerData } = await supabase
                .from('customers')
                .select('id')
                .eq('id', userId)
                .single();

            if (customerData) {
                router.replace('/customer');
                return;
            }

            const { data: providerData } = await supabase
                .from('providers')
                .select('id')
                .eq('id', userId)
                .single();

            if (providerData) {
                router.replace('/service-provider');
                return;
            }

            const userType = user.user_metadata?.provider_type;
            if (userType === 'customer') {
                await supabase.from('customers').insert([{ id: userId, email, username }]);
                router.replace('/customer');
            } else if (userType === 'provider') {
                await supabase.from('providers').insert([{ id: userId, email, username }]);
                router.replace('/service-provider');
            } else {
                Alert.alert('Error', 'User type not recognized.');
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            Alert.alert('Login Error', error.message || "An unknown error occurred.");
        }
    };

    return (
        <ImageBackground source={require('../../assets/images/sample-bg.jpg')} style={styles.backgroundImage}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.subtitle}>Please Authenticate to Continue</Text>

                    <Controller
                        control={control}
                        name='email'
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    placeholder='Email'
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor={'#aaa'}
                                    autoCapitalize='none'
                                    editable={!formState.isSubmitting}
                                />
                                {error && <Text style={styles.error}>{error.message}</Text>}
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name='password'
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    placeholder='Password'
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    secureTextEntry
                                    placeholderTextColor={'#aaa'}
                                    autoCapitalize='none'
                                    editable={!formState.isSubmitting}
                                />
                                {error && <Text style={styles.error}>{error.message}</Text>}
                            </>
                        )}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSubmit(signIn)} disabled={formState.isSubmitting}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={() => router.push('/signup')}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        width: '100%',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#ddd',
        marginBottom: 32,
    },
    input: {
        width: '90%',
        padding: 12,
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        fontSize: 16,
        color: '#000',
    },
    button: {
        backgroundColor: '#6a1b9a',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        width: '90%',
        alignItems: 'center',
    },
    signUpButton: {
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
    },
    signUpButtonText: {
        color: '#fff',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 16,
        textAlign: 'left',
        width: '90%',
    },
});
