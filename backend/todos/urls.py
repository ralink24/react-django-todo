from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, LoginView, get_user
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('user/', get_user),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]