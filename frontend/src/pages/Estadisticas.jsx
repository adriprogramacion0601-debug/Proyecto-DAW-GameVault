import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gamepad2, Award, Clock, Star, Flame } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = {
    completado: '#3b82f6', // blue-500
    jugando: '#22c55e',    // green-500
    pendiente: '#eab308',  // yellow-500
    abandonado: '#ef4444'  // red-500
};

export default function Estadisticas() {
    const [biblioteca, setBiblioteca] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await api.get('/biblioteca');
                setBiblioteca(res.data);
            } catch (err) {
                console.error("Error al cargar estadísticas", err);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="h-12 bg-muted animate-pulse rounded w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1,2,3,4].map(n => <div key={n} className="h-32 bg-muted animate-pulse rounded-xl"></div>)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="h-80 bg-muted animate-pulse rounded-xl"></div>
                    <div className="h-80 bg-muted animate-pulse rounded-xl"></div>
                </div>
            </div>
        );
    }

    // Calcular estadísticas
    const totalJuegos = biblioteca.length;
    const porEstado = biblioteca.reduce((acc, curr) => {
        acc[curr.estado] = (acc[curr.estado] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(porEstado).map(estado => ({
        name: estado.charAt(0).toUpperCase() + estado.slice(1),
        value: porEstado[estado],
        color: COLORS[estado] || '#8884d8'
    }));

    // Calcular géneros (muy rudimentario, basándonos en la columna genero de la BD que es un string)
    // El string de genero viene de RAWG (Action, Adventure...)
    const generoConteo = {};
    biblioteca.forEach(entrada => {
        if (entrada.juego?.genero) {
            const generos = entrada.juego.genero.split(',').map(g => g.trim());
            generos.forEach(g => {
                if (g) generoConteo[g] = (generoConteo[g] || 0) + 1;
            });
        }
    });

    const barData = Object.keys(generoConteo)
        .map(g => ({ name: g, cantidad: generoConteo[g] }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5); // Top 5 géneros

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mi Dashboard Gamer</h1>
                <p className="text-muted-foreground text-lg">Un resumen de tu trayectoria y colección</p>
            </div>

            {totalJuegos === 0 ? (
                <div className="py-24 text-center border border-dashed rounded-3xl bg-card/20">
                    <h2 className="text-2xl font-semibold mb-2">No hay datos suficientes</h2>
                    <p className="text-muted-foreground">Añade juegos a tu biblioteca para generar estadísticas visuales.</p>
                </div>
            ) : (
                <>
                    {/* Tarjetas de Resumen KPI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-primary/20 text-primary rounded-xl"><Gamepad2 className="w-8 h-8" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Juegos</p>
                                        <h3 className="text-3xl font-bold">{totalJuegos}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl"><Award className="w-8 h-8" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Completados</p>
                                        <h3 className="text-3xl font-bold">{porEstado['completado'] || 0}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-green-500/20 text-green-500 rounded-xl"><Flame className="w-8 h-8" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Jugando</p>
                                        <h3 className="text-3xl font-bold">{porEstado['jugando'] || 0}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-xl"><Clock className="w-8 h-8" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                                        <h3 className="text-3xl font-bold">{porEstado['pendiente'] || 0}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Gráfico 1: Estados */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm h-full">
                                <CardHeader>
                                    <CardTitle>Estado de la Biblioteca</CardTitle>
                                    <CardDescription>Distribución de tus juegos según su estado actual</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="hsl(var(--background))"
                                                strokeWidth={2}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Gráfico 2: Géneros (Top 5) */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm h-full">
                                <CardHeader>
                                    <CardTitle>Géneros Favoritos</CardTitle>
                                    <CardDescription>Tus 5 géneros más jugados en la biblioteca</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    {barData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                                                <Tooltip 
                                                    cursor={{fill: 'hsl(var(--muted))'}}
                                                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                                                />
                                                <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                            No hay suficientes datos de géneros
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    );
}
