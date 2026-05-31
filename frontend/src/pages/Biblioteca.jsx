import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Image as ImageIcon, Gamepad2, Search, Star, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ESTADOS = ['jugando', 'completado', 'pendiente', 'abandonado'];

const coloresEstado = {
    jugando: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800/50',
    completado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50',
    abandonado: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800/50',
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
};

export default function Biblioteca() {
    const [biblioteca, setBiblioteca] = useState([]);
    const [misResenas, setMisResenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden] = useState('reciente');

    // Estado del modal de reseña
    const [modalAbierto, setModalAbierto] = useState(false);
    const [juegoResena, setJuegoResena] = useState(null);
    const [formResena, setFormResena] = useState({ puntuacion: 0, comentario: '' });

    useEffect(() => {
        cargarBiblioteca();
        cargarResenas();
    }, []);

    const cargarBiblioteca = async () => {
        try {
            const res = await api.get('/biblioteca');
            setBiblioteca(res.data);
        } catch (err) {
            toast.error('Error al cargar tu biblioteca');
        } finally {
            setLoading(false);
        }
    };

    const cargarResenas = async () => {
        try {
            const res = await api.get('/resenas/mis-resenas');
            setMisResenas(res.data);
        } catch (err) {
            console.error('No se pudieron cargar las reseñas', err);
        }
    }

    const cambiarEstado = async (juegoId, nuevoEstado) => {
        try {
            await api.put(`/biblioteca/${juegoId}`, { estado: nuevoEstado });
            cargarBiblioteca();
            toast.success(`Estado cambiado a ${nuevoEstado}`);
        } catch (err) {
            toast.error('Error al cambiar el estado del juego');
        }
    };

    const eliminarJuego = async (juegoId) => {
        if (!confirm('¿Eliminar este juego de tu biblioteca?')) return;
        try {
            await api.delete(`/biblioteca/${juegoId}`);
            cargarBiblioteca();
            toast.info('Juego eliminado de la biblioteca');
        } catch (err) {
            toast.error('Error al eliminar juego');
        }
    };

    const abrirModalResena = (juegoId) => {
        const resenaExistente = misResenas.find(r => r.juego?.id === juegoId);
        setJuegoResena(juegoId);
        if (resenaExistente) {
            setFormResena({ puntuacion: resenaExistente.puntuacion, comentario: resenaExistente.comentario || '' });
        } else {
            setFormResena({ puntuacion: 0, comentario: '' });
        }
        setModalAbierto(true);
    };

    const guardarResena = async () => {
        if (formResena.puntuacion === 0) {
            toast.error('Por favor, selecciona una puntuación de 1 a 5');
            return;
        }
        
        try {
            const resenaExistente = misResenas.find(r => r.juego?.id === juegoResena);
            if (resenaExistente) {
                // Editar
                await api.put(`/resenas/${juegoResena}`, {
                    puntuacion: String(formResena.puntuacion),
                    comentario: formResena.comentario
                });
                toast.success('Reseña actualizada');
            } else {
                // Crear
                await api.post('/resenas', {
                    juegoId: String(juegoResena),
                    puntuacion: String(formResena.puntuacion),
                    comentario: formResena.comentario
                });
                toast.success('Reseña publicada con éxito');
            }
            setModalAbierto(false);
            cargarResenas();
        } catch (err) {
            toast.error('Error al guardar la reseña');
        }
    };

    // Procesamiento de la lista: Filtrado y Búsqueda
    let bibliotecaFiltrada = biblioteca;
    
    if (filtro !== 'todos') {
        bibliotecaFiltrada = bibliotecaFiltrada.filter(e => e.estado === filtro);
    }
    
    if (busqueda.trim() !== '') {
        bibliotecaFiltrada = bibliotecaFiltrada.filter(e => 
            e.juego?.titulo.toLowerCase().includes(busqueda.toLowerCase())
        );
    }

    // Ordenación
    if (orden === 'a-z') {
        bibliotecaFiltrada.sort((a, b) => a.juego?.titulo.localeCompare(b.juego?.titulo));
    } else if (orden === 'z-a') {
        bibliotecaFiltrada.sort((a, b) => b.juego?.titulo.localeCompare(a.juego?.titulo));
    } else {
        // Reciente (ID descendente asumiendo auto-increment)
        bibliotecaFiltrada.sort((a, b) => b.id - a.id);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col border-b border-border/50 pb-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mi Biblioteca</h1>
                        <p className="text-muted-foreground text-lg">Gestiona y organiza tu colección personal de videojuegos</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['todos', ...ESTADOS].map((estado) => (
                            <Button
                                key={estado}
                                variant={filtro === estado ? "default" : "secondary"}
                                onClick={() => setFiltro(estado)}
                                className={`capitalize rounded-full px-5 transition-all ${filtro === estado ? 'shadow-md shadow-primary/20' : ''}`}
                            >
                                {estado}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Barra de Herramientas: Búsqueda y Orden */}
                <div className="flex flex-col sm:flex-row gap-4 bg-muted/20 p-3 rounded-xl border border-border/50 backdrop-blur-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar en mi biblioteca..." 
                            className="pl-9 bg-background/50 border-border/50"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <select 
                        className="bg-background/50 border border-border/50 text-foreground text-sm rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
                        value={orden}
                        onChange={(e) => setOrden(e.target.value)}
                    >
                        <option value="reciente">Añadidos recientemente</option>
                        <option value="a-z">Nombre (A-Z)</option>
                        <option value="z-a">Nombre (Z-A)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1,2,3,4].map(n => (
                        <Card key={n} className="animate-pulse border-border/50 bg-card/50">
                            <div className="w-full aspect-[4/3] bg-muted/60"></div>
                            <CardHeader className="p-4"><div className="h-5 bg-muted rounded w-3/4"></div></CardHeader>
                            <CardContent className="p-4 pt-0 space-y-3">
                                <div className="h-9 bg-muted rounded w-full"></div>
                                <div className="h-8 bg-muted rounded w-full"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : bibliotecaFiltrada.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed rounded-3xl border-muted bg-card/20">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                        <Gamepad2 className="w-20 h-20 opacity-30 mb-6 relative z-10" />
                    </div>
                    <p className="text-2xl font-semibold text-foreground">No hay resultados</p>
                    <p className="mt-2 text-lg">Prueba a buscar otro nombre o cambia los filtros</p>
                </motion.div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {bibliotecaFiltrada.map((entrada) => {
                        const tieneResena = misResenas.find(r => r.juego?.id === entrada.juego.id);
                        
                        return (
                        <motion.div variants={itemVariants} key={entrada.id}>
                            <Card className="overflow-hidden flex flex-col group h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative">
                                <Link to={`/juego/${entrada.juego.rawgId}`} className="absolute inset-0 z-0"></Link>
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted pointer-events-none">
                                    {entrada.juego?.imagen ? (
                                        <>
                                            <img
                                                src={entrada.juego.imagen}
                                                alt={entrada.juego.titulo}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                            <ImageIcon className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${coloresEstado[entrada.estado]}`}>
                                            {entrada.estado}
                                        </span>
                                    </div>
                                    {tieneResena && (
                                        <div className="absolute bottom-3 left-3">
                                            <span className="flex items-center text-yellow-400 font-bold bg-black/50 px-2 py-0.5 rounded-md text-xs backdrop-blur-md border border-yellow-500/20">
                                                <Star className="w-3 h-3 fill-current mr-1" /> {tieneResena.puntuacion}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="p-4 flex-none pb-3 relative z-10 bg-card pointer-events-none border-t border-border/30">
                                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors" title={entrada.juego?.titulo}>
                                        {entrada.juego?.titulo}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-4 pt-0 mt-auto flex flex-col gap-2 bg-card relative z-20">
                                    <div className="grid grid-cols-4 gap-2 mb-1">
                                        <div className="col-span-3">
                                            <select
                                                value={entrada.estado}
                                                onChange={(e) => cambiarEstado(entrada.juego.id, e.target.value)}
                                                className="w-full bg-secondary/80 text-secondary-foreground text-xs font-semibold uppercase tracking-wider rounded-md px-3 py-2 border border-transparent hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                                            >
                                                {ESTADOS.map((estado) => (
                                                    <option key={estado} value={estado}>{estado}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <Button 
                                            variant={tieneResena ? "default" : "secondary"} 
                                            size="icon" 
                                            className="w-full h-full"
                                            title={tieneResena ? "Editar reseña" : "Escribir reseña"}
                                            onClick={() => abrirModalResena(entrada.juego.id)}
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => eliminarJuego(entrada.juego.id)}
                                        className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                                        Retirar de la biblioteca
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )})}
                </motion.div>
            )}

            {/* Modal de Reseñas */}
            <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogContent className="sm:max-w-md border-primary/20 bg-background/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle>Tu valoración</DialogTitle>
                        <DialogDescription>
                            Puntúa el juego y deja un comentario sobre tu experiencia.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Puntuación</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                        onClick={() => setFormResena({ ...formResena, puntuacion: star })}
                                    >
                                        <Star 
                                            className={`w-10 h-10 ${formResena.puntuacion >= star ? 'text-yellow-400 fill-current' : 'text-muted stroke-[1.5px]'}`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Comentario (opcional)</label>
                            <Textarea 
                                placeholder="¿Qué te ha parecido el juego? Escribe tu reseña aquí..."
                                className="resize-none min-h-[120px] bg-muted/50 focus-visible:ring-primary"
                                value={formResena.comentario}
                                onChange={(e) => setFormResena({ ...formResena, comentario: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setModalAbierto(false)}>Cancelar</Button>
                        <Button onClick={guardarResena}>Guardar Reseña</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}