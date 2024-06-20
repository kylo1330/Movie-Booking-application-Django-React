from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.signup, name='signup_api'),
    path('login', views.login, name='login_api'),
    path('logout', views.logout, name='logout_api'),
    path('create_event', views.create_event, name='createeventapi'),
    path('list_event', views.list_event, name='listeventapi'),
    path('update_event/<int:pk>', views.update_event, name='updateeventapi'),
    path('delete_event/<int:pk>', views.delete_event, name='deleteeventapi'),
    path('toggle_movie_status/<int:pk>', views.ToggleMovieStatusView.as_view(), name='toggle_movie_status_api'),
    path('event/<int:pk>', views.movie_detail, name='movie_detail_api'),
 
    path('movie_detail_user/<int:movie_id>/', views.movie_detail_user, name='movie_detail_user'),
    path('movie_Booking/<int:pk>/', views.movie_Booking, name='movie_Booking'),
    path('view_movie/<int:pk>/', views.view_movie, name='view_movie_api'),
    path('create_order/', views.create_order, name='create_order'),
    path('booking_history/<int:user_id>', views.booking_history, name='booking_history'),
    path('send_email', views.send_mail, name='send_email'),

]
