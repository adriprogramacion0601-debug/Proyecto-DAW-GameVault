import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Star, Calendar, Monitor, Gamepad2, User, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function JuegoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [juego, setJuego] = useState(null);
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anadiendo, setAnadiendo] = useState(false);

    useEffect(() => {
        const fetchJuego = async () => {
            try {
                // Fetch detalles de RAWG desde nuestro backend
                const res = await api.get(`/juegos/${id}`);
                setJuego(res.data);
                
                // Fetch reseñas de la BD local (Opcional por ahora, si el juego no está en BD fallará o devolverá vacío)
                // Para obtener reseñas necesitamos el ID interno del juego en nuestra BD, no el rawgId.
                // Como workaround, lo omitimos hasta tener el modal de reseña en Biblioteca.
                
            } catch (err) {
                toast.error('No se pudo cargar la información del juego');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchJuego();
    }, [id, navigate]);

    const anadirABiblioteca = async () => {
        setAnadiendo(true);
        try {
            const resJuego = await api.post(`/juegos/guardar/${id}`);
            const juegoId = resJuego.data.id;
            await api.post('/biblioteca', {
                juegoId: String(juegoId),
                estado: 'pendiente'
            });
            toast.success('¡Juego añadido a tu biblioteca!');
        } catch (err) {
            if (err.response?.status === 500 || err.response?.status === 400) {
                toast.warning('Este juego ya está en tu biblioteca');
            } else {
                toast.error('Error al añadir el juego');
            }
        } finally {
            setAnadiendo(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500 pb-10">
                <div className="w-full h-[50vh] min-h-[400px] bg-muted animate-pulse rounded-3xl"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-10 bg-muted animate-pulse rounded w-3/4"></div>
                        <div className="h-32 bg-muted animate-pulse rounded w-full"></div>
                    </div>
                    <div className="h-64 bg-muted animate-pulse rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (!juego) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </Button>

            {/* Hero Banner */}
            <div className="relative w-full h-[50vh] min-h-[400px] rounded-3xl overflow-hidden bg-card border shadow-lg group">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20"></div>
                {juego.background_image ? (
                    <img
                        src={juego.background_image}
                        alt={juego.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Gamepad2 className="w-24 h-24 opacity-20" />
                    </div>
                )}
                
                <div className="absolute inset-0 z-30 p-8 md:p-12 flex flex-col justify-end">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {juego.genres?.map(g => (
                                <span key={g.id} className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-semibold backdrop-blur-md">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                            {juego.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/80">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> {juego.released || 'Fecha desconocida'}
                            </span>
                            {juego.rating > 0 && (
                                <span className="flex items-center gap-2 text-yellow-400 font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                                    <Star className="w-4 h-4 fill-current" /> {juego.rating} / 5
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Content Left */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">Acerca del juego</h2>
                        <div 
                            className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: juego.description || juego.description_raw || 'Sin descripción.' }}
                        />
                    </section>
                </div>

                {/* Sidebar Right */}
                <div className="space-y-6">
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-md">
                        <CardContent className="p-6">
                            <Button 
                                size="lg" 
                                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1"
                                onClick={anadirABiblioteca}
                                disabled={anadiendo}
                            >
                                {anadiendo ? <span className="animate-pulse">Añadiendo...</span> : (
                                    <><Plus className="w-5 h-5 mr-2" /> Añadir a mi Biblioteca</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground/80">
                                    <Monitor className="w-4 h-4" /> Plataformas
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {juego.platforms?.map(p => (
                                        <span key={p.platform.id} className="text-sm bg-background border px-2.5 py-1 rounded-md shadow-sm text-muted-foreground">
                                            {p.platform.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {juego.developers?.length > 0 && (
                                <div className="pt-4 border-t border-border/50">
                                    <h3 className="font-semibold mb-1 text-foreground/80">Desarrollador</h3>
                                    <p className="text-muted-foreground">{juego.developers[0].name}</p>
                                </div>
                            )}
                            
                            {juego.publishers?.length > 0 && (
                                <div className="pt-4 border-t border-border/50">
                                    <h3 className="font-semibold mb-1 text-foreground/80">Editor</h3>
                                    <p className="text-muted-foreground">{juego.publishers[0].name}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
