import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Star, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Home() {
    const [busqueda, setBusqueda] = useState('');
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(false);

    const buscarJuegos = async (e) => {
        e.preventDefault();
        if (!busqueda.trim()) return;
        setLoading(true);
        try {
            const res = await api.get(`/juegos/buscar?nombre=${busqueda}`);
            setJuegos(res.data.results || []);
            if (res.data.results?.length === 0) {
                toast.info('No se encontraron juegos con ese nombre');
            }
        } catch (err) {
            toast.error('Error al buscar juegos. Verifica la conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const anadirABiblioteca = async (rawgId) => {
        try {
            const resJuego = await api.post(`/juegos/guardar/${rawgId}`);
            const juegoId = resJuego.data.id;
            await api.post('/biblioteca', {
                juegoId: String(juegoId),
                estado: 'pendiente'
            });
            toast.success('¡Juego añadido a tu biblioteca!');
        } catch (err) {
            if (err.response?.status === 500) {
                toast.warning('Este juego ya está en tu biblioteca');
            } else {
                toast.error('Error al añadir el juego a la biblioteca');
            }
        }
    };

    return (
        <div className="space-y-12 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-card border shadow-sm px-6 py-16 md:py-24 flex flex-col items-center text-center">
                {/* Decorative background elements */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

                <div className="relative z-10 space-y-6">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-4">
                            Nueva experiencia de búsqueda
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Descubre tu próximo <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">favorito</span>
                        </h1>
                    </motion.div>
                    
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        Busca cualquier videojuego en nuestra extensa base de datos global y añádelo a tu colección personal en un instante.
                    </motion.p>
                    
                    <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} onSubmit={buscarJuegos} className="flex w-full max-w-xl mx-auto items-center gap-2 mt-8 relative">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Ej: Minecraft, The Legend of Zelda..."
                                className="h-14 pl-12 pr-4 rounded-full bg-background/50 backdrop-blur-sm border-2 border-primary/20 focus-visible:ring-0 focus-visible:border-primary shadow-sm text-base transition-all"
                            />
                        </div>
                        <Button type="submit" size="lg" disabled={loading} className="h-14 rounded-full px-8 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
                            {loading ? <span className="animate-pulse">Buscando...</span> : 'Buscar'}
                        </Button>
                    </motion.form>
                </div>
            </div>

            {/* Results Section */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <Card key={n} className="overflow-hidden animate-pulse border-border/50">
                                <div className="aspect-[4/3] bg-muted/60"></div>
                                <CardHeader className="p-4">
                                    <div className="h-5 bg-muted rounded-md w-3/4 mb-2"></div>
                                    <div className="h-4 bg-muted rounded-md w-1/4"></div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="h-10 bg-muted rounded-md w-full"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : juegos.length > 0 ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4"
                    >
                        {juegos.map((juego) => (
                            <motion.div variants={itemVariants} key={juego.id}>
                                <Card className="overflow-hidden flex flex-col group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm relative">
                                    <Link to={`/juego/${juego.id}`} className="absolute inset-0 z-0"></Link>
                                    <div className="relative aspect-[4/3] overflow-hidden bg-muted pointer-events-none">
                                        {juego.background_image ? (
                                            <>
                                                <img
                                                    src={juego.background_image}
                                                    alt={juego.name}
                                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                                <Gamepad2 className="w-12 h-12 opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="p-4 flex-none relative z-10 bg-card pointer-events-none">
                                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors" title={juego.name}>
                                            {juego.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center justify-between mt-1">
                                            <span className="font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-sm text-xs">
                                                {juego.released?.split('-')[0] || 'N/A'}
                                            </span>
                                            {juego.rating > 0 && (
                                                <span className="flex items-center text-yellow-500 font-medium text-sm">
                                                    <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                                                    {juego.rating}
                                                </span>
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 mt-auto bg-card relative z-20">
                                        <Button 
                                            onClick={() => anadirABiblioteca(juego.id)} 
                                            variant="secondary" 
                                            className="w-full relative overflow-hidden group/btn cursor-pointer"
                                        >
                                            <span className="relative z-10 flex items-center">
                                                <Plus className="w-4 h-4 mr-2" /> Añadir
                                            </span>
                                            <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                                            <span className="absolute inset-0 z-10 flex items-center justify-center text-primary-foreground opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                                                <Plus className="w-4 h-4 mr-2" /> Añadir
                                            </span>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                            <Search className="w-20 h-20 opacity-30 mb-6 relative z-10" />
                        </div>
                        <p className="text-2xl font-semibold text-foreground">El universo te espera</p>
                        <p className="mt-2 text-lg">Busca un juego para empezar a construir tu colección</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}