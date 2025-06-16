FROM php:8.4-fpm

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installer Composer
COPY --from=composer:2.8.9 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copier le code source (optionnel en dev, car volume monté)
COPY . .

# Installer les dépendances PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Droits pour www-data
RUN chown -R www-data:www-data /var/www

EXPOSE 9000
CMD ["php-fpm"]
