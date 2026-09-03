const mongoose = require('mongoose');
const Route = require('../models/Route');
const Stop = require('../models/Stop');
const routeService = require('./routeService');
const stopService = require('./stopService');
const reviewService = require('./reviewService');
const ticketService = require('./ticketService');
const ticketProductService = require('./ticketProductService');

const SCREEN_ACTIONS = {
    home: { type: 'open_home' },
    tickets: { type: 'open_tickets' },
    payment: { type: 'open_payment' },
    my_tickets: { type: 'open_my_tickets' },
    language: { type: 'open_language' },
};

const FUNCTION_DECLARATIONS = [
    {
        name: 'search_routes',
        description:
            'Search real bus routes in DanaBus by keyword (code, name, start/end). Use for questions about available routes.',
        parametersJsonSchema: {
            type: 'object',
            properties: {
                search: {
                    type: 'string',
                    description: 'Keyword such as route code or place name',
                },
                onlyHot: {
                    type: 'boolean',
                    description: 'If true, only featured/hot routes',
                },
                limit: {
                    type: 'number',
                    description: 'Max results 1-10, default 8',
                },
            },
        },
    },
    {
        name: 'get_route_detail',
        description:
            'Get one route by Mongo id or route code/name. Use before answering details about a specific route.',
        parametersJsonSchema: {
            type: 'object',
            properties: {
                routeIdOrCode: {
                    type: 'string',
                    description: 'Route ObjectId, code (e.g. Route_01), or name',
                },
            },
            required: ['routeIdOrCode'],
        },
    },
    {
        name: 'list_stops_by_route',
        description:
            'List stops of a route in order, with scheduled times when available.',
        parametersJsonSchema: {
            type: 'object',
            properties: {
                routeIdOrCode: {
                    type: 'string',
                    description: 'Route ObjectId, code, or name',
                },
                limit: {
                    type: 'number',
                    description: 'Max stops 1-50, default 40',
                },
            },
            required: ['routeIdOrCode'],
        },
    },
    {
        name: 'search_stops',
        description: 'Search stops by name across routes.',
        parametersJsonSchema: {
            type: 'object',
            properties: {
                search: {
                    type: 'string',
                    description: 'Stop name keyword',
                },
                limit: {
                    type: 'number',
                    description: 'Max results 1-15, default 10',
                },
            },
            required: ['search'],
        },
    },
    {
        name: 'get_route_reviews',
        description:
            'Get rating summary and recent passenger reviews for a route.',
        parametersJsonSchema: {
            type: 'object',
            properties: {
                routeIdOrCode: {
                    type: 'string',
                    description: 'Route ObjectId, code, or name',
                },
                limit: {
                    type: 'number',
                    description: 'Recent reviews 1-8, default 5',
                },
            },
            required: ['routeIdOrCode'],
        },
    },
    {
        name: 'list_my_tickets',
        description:
            'List the logged-in passenger tickets (status, route, type, price). Never invent tickets.',
        parametersJsonSchema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['pending', 'paid', 'active', 'used', 'expired', 'cancelled'],
                    description: 'Optional status filter',
                },
                onlyAvailableQr: {
                    type: 'boolean',
                    description: 'If true, only tickets still usable with QR',
                },
                limit: {
                    type: 'number',
                    description: 'Max tickets 1-10, default 5',
                },
            },
        },
    },
    {
        name: 'list_ticket_products',
        description:
            'Get current DanaBus ticket product types and prices from the catalog.',
        parametersJsonSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'suggest_app_screen',
        description:
            'Hand the user to an existing app screen. Use home for A-to-B trip search (do not compute itineraries).',
        parametersJsonSchema: {
            type: 'object',
            properties: {
                screen: {
                    type: 'string',
                    enum: ['home', 'tickets', 'payment', 'my_tickets', 'language'],
                },
            },
            required: ['screen'],
        },
    },
];

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isObjectId(value) {
    return mongoose.Types.ObjectId.isValid(value) && String(value).length === 24;
}

async function resolveRoute(routeIdOrCode) {
    const raw = String(routeIdOrCode || '').trim();
    if (!raw) return null;

    if (isObjectId(raw)) {
        const byId = await Route.findById(raw).lean();
        if (byId) return byId;
    }

    const exactCode = await Route.findOne({
        code: new RegExp(`^${escapeRegex(raw)}$`, 'i'),
    }).lean();
    if (exactCode) return exactCode;

    const loose = await Route.findOne({
        $or: [
            { code: new RegExp(escapeRegex(raw), 'i') },
            { name: new RegExp(escapeRegex(raw), 'i') },
            { startName: new RegExp(escapeRegex(raw), 'i') },
            { endName: new RegExp(escapeRegex(raw), 'i') },
        ],
    }).lean();
    return loose;
}

function mapRoute(route) {
    return {
        id: String(route._id),
        code: route.code,
        name: route.name,
        startName: route.startName || '',
        endName: route.endName || '',
        description: (route.description || '').slice(0, 240),
        isHot: Boolean(route.isHot),
        turnOnDay: route.turnOnDay ?? 0,
    };
}

function mapStop(stop) {
    return {
        id: String(stop._id),
        stopCode: stop.stopCode || stop.stopId || '',
        name: stop.name,
        order: stop.order ?? 0,
        times: Array.isArray(stop.times) ? stop.times.slice(0, 8) : [],
        lat: stop.location?.coordinates?.[1],
        lng: stop.location?.coordinates?.[0],
    };
}

function mapTicket(ticket) {
    return {
        id: String(ticket._id),
        routeName: ticket.routeName,
        routeId: ticket.routeId ? String(ticket.routeId) : null,
        startStopName: ticket.startStopName,
        endStopName: ticket.endStopName,
        ticketType: ticket.ticketType,
        status: ticket.status,
        price: ticket.price,
        departureDate: ticket.departureDate,
        departureTime: ticket.departureTime,
        expiryDate: ticket.expiryDate || null,
        purchaseDate: ticket.purchaseDate || ticket.createdAt || null,
    };
}

function pushAction(actions, screen) {
    const action = SCREEN_ACTIONS[screen];
    if (!action) return;
    if (!actions.some((item) => item.type === action.type)) {
        actions.push(action);
    }
}

async function executeTool(name, args = {}, context = {}) {
    const { userId, actions = [] } = context;
    const limit = (value, fallback, max) => {
        const n = Number(value);
        if (!Number.isFinite(n) || n <= 0) return fallback;
        return Math.min(Math.floor(n), max);
    };

    try {
        if (name === 'search_routes') {
            const routes = await routeService.listRoutes({
                page: 1,
                limit: limit(args.limit, 8, 10),
                search: args.search || '',
                sort: 'newest',
            });
            let items = routes.map(mapRoute);
            if (args.onlyHot) {
                items = items.filter((route) => route.isHot);
            }
            return { count: items.length, routes: items };
        }

        if (name === 'get_route_detail') {
            const route = await resolveRoute(args.routeIdOrCode);
            if (!route) return { found: false, message: 'Route not found' };
            const stopCount = await Stop.countDocuments({ routeId: route._id });
            return { found: true, route: { ...mapRoute(route), stopCount } };
        }

        if (name === 'list_stops_by_route') {
            const route = await resolveRoute(args.routeIdOrCode);
            if (!route) return { found: false, message: 'Route not found' };
            const stops = await stopService.listStopsByRoute({
                routeId: route._id,
                page: 1,
                limit: limit(args.limit, 40, 50),
            });
            return {
                found: true,
                route: mapRoute(route),
                count: stops.length,
                stops: stops.map(mapStop),
            };
        }

        if (name === 'search_stops') {
            const search = String(args.search || '').trim();
            if (!search) return { count: 0, stops: [] };
            const re = new RegExp(escapeRegex(search), 'i');
            const stops = await Stop.find({ name: re })
                .sort({ order: 1 })
                .limit(limit(args.limit, 10, 15))
                .populate('routeId', 'code name startName endName')
                .lean();
            return {
                count: stops.length,
                stops: stops.map((stop) => ({
                    ...mapStop(stop),
                    route: stop.routeId
                        ? {
                              id: String(stop.routeId._id),
                              code: stop.routeId.code,
                              name: stop.routeId.name,
                          }
                        : null,
                })),
            };
        }

        if (name === 'get_route_reviews') {
            const route = await resolveRoute(args.routeIdOrCode);
            if (!route) return { found: false, message: 'Route not found' };
            const [summary, reviews] = await Promise.all([
                reviewService.getReviewSummary(route._id),
                reviewService.listReviews({
                    page: 1,
                    limit: limit(args.limit, 5, 8),
                    route: route._id,
                    sort: 'newest',
                }),
            ]);
            return {
                found: true,
                route: mapRoute(route),
                summary,
                reviews: reviews.map((review) => ({
                    rating: review.rating,
                    content: (review.content || '').slice(0, 200),
                    userName: review.user?.full_name || 'Passenger',
                    createdAt: review.createdAt,
                })),
            };
        }

        if (name === 'list_my_tickets') {
            if (!userId) {
                return { error: 'User must be logged in to view tickets' };
            }
            const result = await ticketService.getMyTickets(userId, {
                page: 1,
                limit: limit(args.limit, 5, 10),
                status: args.status,
                onlyAvailableQr: Boolean(args.onlyAvailableQr),
                includeQr: false,
            });
            return {
                total: result.total,
                tickets: result.items.map(mapTicket),
            };
        }

        if (name === 'list_ticket_products') {
            const products = await ticketProductService.listActiveProducts();
            return {
                products: products.map((product) => ({
                    code: product.code,
                    title: product.title,
                    validity: product.validity,
                    unitPrice: product.unitPrice,
                })),
            };
        }

        if (name === 'suggest_app_screen') {
            pushAction(actions, args.screen);
            return { ok: true, screen: args.screen };
        }

        return { error: `Unknown tool: ${name}` };
    } catch (error) {
        return { error: error.message || 'Tool failed' };
    }
}

module.exports = {
    FUNCTION_DECLARATIONS,
    executeTool,
};
